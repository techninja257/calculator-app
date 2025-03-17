pipeline {
  agent any
  environment {
    DOCKER_IMAGE = "vigta257/calculator-app" // Update this!
  }
  stages {
    stage('Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE}:${BUILD_ID} ."
      }
    }
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
    stage('Deploy') {
      steps {
        sh "docker run -d --name myapp -p 3000:3000 ${DOCKER_IMAGE}:${BUILD_ID}"
      }
    }
  }
  post {
    always {
      sh 'docker system prune -f' // Cleanup unused Docker artifacts
    }
  }
}
