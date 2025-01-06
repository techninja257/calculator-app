pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials') // Docker Hub credentials ID in Jenkins
        REMOTE_SERVER_CREDENTIALS = credentials('remote-server-ssh')  // SSH credentials ID
        IMAGE_NAME = 'calculator-app'
        DOCKER_REPO = 'vigta257/calculator-app'
        REMOTE_SERVER = '192.168.0.149'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/vigta257/calculator-app.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_REPO}:latest ."
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'DOCKER_HUB_CREDENTIALS') {
                        sh "docker push ${DOCKER_REPO}:latest"
                    }
                }
            }
        }
        stage('Deploy to Remote Server') {
            steps {
                sshagent(['REMOTE_SERVER_CREDENTIALS']) {
                    script {
                        sh """
                        ssh -o StrictHostKeyChecking=no ${env.REMOTE_SERVER} << EOF
                        docker pull ${DOCKER_REPO}:latest
                        docker stop calculator-container || true
                        docker rm calculator-container || true
                        docker run -d --name calculator-container -p 80:80 ${DOCKER_REPO}:latest
                        EOF
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            echo "Pipeline completed."
        }
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
