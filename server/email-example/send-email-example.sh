aws --profile ses-circade \
  --region us-west-2 \
  ses send-email \
  --from hello@circade.today \
  --destination file://destination.json \
  --message file://message.json
