terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }

  backend "pg" {
    conn_str = var.postgres_backend_connection_string
    schema_name = "open_tofu_state"
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}
