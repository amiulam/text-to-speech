FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

RUN go build -o text-to-speech ./cmd/...

RUN chmod +x text-to-speech

EXPOSE 9876

CMD ["./text-to-speech"]