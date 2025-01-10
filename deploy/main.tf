# Namespace
resource "kubernetes_namespace" "app" {
  metadata {
    name = "next-template-pr-1"
  }
}

# ConfigMap
resource "kubernetes_config_map" "app" {
  depends_on = [kubernetes_namespace.app]

  metadata {
    name      = "next-template-config"
    namespace = "next-template-pr-1"
  }

  data = {
  }
}

# Secret
resource "kubernetes_secret" "app" {
  depends_on = [kubernetes_namespace.app]

  metadata {
    name      = "next-template-secret"
    namespace = "next-template-pr-1"
  }

  data = {
  }
}

# Deployment
resource "kubernetes_deployment" "app" {
  depends_on = [
    kubernetes_namespace.app,
    kubernetes_config_map.app,
    kubernetes_secret.app
  ]

  metadata {
    name      = "next-template-deployment"
    namespace = "next-template-pr-1"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "next-template-deployment"
      }
    }

    template {
      metadata {
        labels = {
          app = "next-template-deployment"
        }
      }

      spec {
        automount_service_account_token = false

        container {
          name  = "next-template"
          image = "rutger505/next-template:latest"

          resources {
            limits = {
              cpu    = "1000m"    # 1 CPU core
              memory = "1024Mi"   # 1GB memory
            }
            requests = {
              cpu    = "250m"     # 0.25 CPU core
              memory = "512Mi"    # 512MB memory
            }
          }

          port {
            container_port = 3000
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app.metadata[0].name
            }
          }
        }
      }
    }
  }
}

# Service
resource "kubernetes_service" "app" {
  depends_on = [kubernetes_namespace.app]

  metadata {
    name      = "next-template-service"
    namespace = "next-template-pr-1"
  }

  spec {
    selector = {
      app = "next-template-deployment"
    }

    port {
      port        = 80
      target_port = 3000
      protocol    = "TCP"
    }

    type = "ClusterIP"
  }
}



# Ingress
resource "kubernetes_ingress_v1" "app" {
  depends_on = [
    kubernetes_namespace.app,
    kubernetes_service.app,
  ]

  metadata {
    name      = "next-template-ingress"
    namespace = "next-template-pr-1"
  }

  spec {
    ingress_class_name = "traefik"

    tls {
      hosts       = ["https://hello.com"]
      secret_name = "next-template-tls"
    }

    rule {
      host = "https://hello.com"

      http {
        path {
          path      = "/"
          path_type = "Prefix"

          backend {
            service {
              name = kubernetes_service.app.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}

# Certificate
resource "kubernetes_manifest" "app" {
  depends_on = [
    kubernetes_namespace.app,
    kubernetes_ingress_v1.app
  ]

  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "Certificate"
    metadata = {
      name      = "next-template-certificate"
      namespace = "next-template-pr-1"
    }
    spec = {
      secretName   = "next-template-tls"
      duration     = "2160h" # 90d
      renewBefore  = "360h" # 15d
      dnsNames     = ["https://hello.com"]
      issuerRef = {
        name = "staging"
        kind = "ClusterIssuer"
      }
    }
  }
}