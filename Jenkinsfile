pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'vigta257/calculator-app'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'github-token', url: 'https://github.com/vigta257/calculator-app.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    // Run tests inside a temporary container
                    docker.image("${DOCKER_IMAGE}:latest").inside {
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, 'docker-hub') {
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }
        stage('Deploy to Server') {
            steps {
                script {
                    sshagent(['id_rsa']) {
                        sh '''
                        ssh techninja@192.168.0.149 << EOF
                        docker pull ${DOCKER_IMAGE}:latest
                        docker stop calculator-app || true
                        docker rm calculator-app || true
                        docker run -d --name calculator-app -p 3000:3000 ${DOCKER_IMAGE}:latest
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
