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
    name      = "${var.app_name}-config"
    namespace = var.namespace
  }

  data = {
  }
}

# Secret
resource "kubernetes_secret" "app" {
  depends_on = [kubernetes_namespace.app]

  metadata {
    name      = "${var.app_name}-secret"
    namespace = var.namespace
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
    name      = "${var.app_name}-deployment"
    namespace = var.namespace
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "${var.app_name}-deployment"
      }
    }

    template {
      metadata {
        labels = {
          app = "${var.app_name}-deployment"
        }
      }

      spec {
        automount_service_account_token = false

        container {
          name  = var.app_name
          image = "${var.image_repository}:${var.image_tag}"

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
            container_port = var.app_port
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
    name      = "${var.app_name}-service"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "${var.app_name}-deployment"
    }

    port {
      port        = 80
      target_port = var.app_port
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
    name      = "${var.app_name}-ingress"
    namespace = var.namespace
  }

  spec {
    ingress_class_name = "traefik"

    tls {
      hosts       = [var.ingress_host]
      secret_name = "${var.app_name}-tls"
    }

    rule {
      host = var.ingress_host

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
      name      = "${var.app_name}-certificate"
      namespace = var.namespace
    }
    spec = {
      secretName   = "${var.app_name}-tls"
      duration     = "2160h" # 90d
      renewBefore  = "360h" # 15d
      dnsNames     = [var.ingress_host]
      issuerRef = {
        name = var.certificate_cluster_issuer
        kind = "ClusterIssuer"
      }
    }
  }
}