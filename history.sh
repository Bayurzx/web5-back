echo $API_KEY
echo API_KEY
export API_KEY=AIzaSyCUv0gCgw4PGUAn4D93p8a536IC6BclVCs
echo $API_KEY
ls
curl -s -X POST -H "Content-Type: application/json" --data-binary @ocr-request.json  https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}
curl -s -X POST -H "Content-Type: application/json" --data-binary @ocr-request.json  https://vision.googleapis.com/v1/images:annotate?key=${API_KEY} -o ocr-response.json
ls -al
cat nl-request.json 
curl "https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}"   -s -X POST -H "Content-Type: application/json" --data-binary @nl-request.json
curl "https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}"   -s -X POST -H "Content-Type: application/json" --data-binary @nl-request.json -o nl-response.json
ls *.json
