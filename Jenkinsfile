pipeline {
  agent any
  environment {
    DOCKER_IMAGE = "vigta257/calculator-app"
    DOCKER_CREDS = credentials('dockerhub-credentials')
  }
  stages {
    // Build Docker Image
    stage('Build') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE}:${BUILD_ID} ."
      }
    }

    // Push to Docker Hub
    stage('Push') {
      steps {
        script {
          withCredentials([usernamePassword(
            credentialsId: 'dockerhub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
          )]) {
            sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
            sh "docker push ${DOCKER_IMAGE}:${BUILD_ID}"
          }
        }
      }
    }

    // Deploy to Server
    stage('Deploy') {
      steps {
        sh """
          docker stop calculator-app || true
          docker rm calculator-app || true
          docker run -d --name calculator-app -p 3000:3000 ${DOCKER_IMAGE}:${BUILD_ID}
        """
      }
    }
  }
  post {
    always {
      sh 'docker system prune -f'  // Cleanup unused Docker artifacts
    }
  }
}
