package middleware

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/amiulam/text-to-speech/internal/configs"
	jwtUtils "github.com/amiulam/text-to-speech/pkg/jwt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	secretKey := configs.Get().Service.SecretJWT

	return func(ctx *gin.Context) {
		header := ctx.Request.Header.Get("Authorization")
		header = strings.TrimSpace(header)
		if header == "" {
			ctx.AbortWithError(http.StatusUnauthorized, errors.New("missing token"))
			return
		}

		userID, username, err := jwtUtils.ValidateToken(header, secretKey)
		log.Println(err)

		if err != nil {
			if errors.Is(err, jwt.ErrTokenMalformed) {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "token malformed",
				})
			}
			if errors.Is(err, jwt.ErrTokenExpired) {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "token expired",
				})
			}
			return
		}

		ctx.Set("userID", userID)
		ctx.Set("username", username)
		ctx.Next()
	}
}
