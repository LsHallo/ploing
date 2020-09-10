pipeline {
   environment {
      registry = 'hub.lshallo.eu/ploing'
   }
   agent any
   stages {
       stage('Cloning git') {
           steps {
            checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'CleanBeforeCheckout', deleteUntrackedNestedRepositories: true]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/LsHallo/ploing.git']]])
          }
       }
       stage('Build image and push to docker hub') {
          steps{
            script {
                withCredentials([usernamePassword(credentialsId: 'lshalloDockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh('docker login --username $username --password $password hub.lshallo.eu')
                }

                sh('docker buildx rm ploingbuilder || true')
                sh('docker buildx create --name ploingbuilder --use')
                sh("docker buildx build --tag $registry:latest --platform=linux/amd64 --push .")
                sh('docker buildx rm ploingbuilder || true')
            }
          }
        }
   }
}
