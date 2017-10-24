FROM circleci/node:8.7

RUN export CLOUD_SDK_REPO="cloud-sdk-jessie" && echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && sudo apt-get update && sudo apt-get install -y google-cloud-sdk
