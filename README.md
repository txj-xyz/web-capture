# `web-capture`
WebRTC implementation of capturing media via Screen / Window / Application / Webcam

## Demo
An example demo can be found [here](https://txj-xyz.github.io/web-capture/)

## Building
This project uses GO to run a local instance of the server if you wish to not use local file paths

```bash
$ GOOS=windows GOARCH=amd64 go build -o server.exe server.go
```