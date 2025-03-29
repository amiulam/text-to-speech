package memberships

import (
	"net/http"

	"github.com/amiulam/text-to-speech/helpers"
	"github.com/gin-gonic/gin"
)

func (h *Handler) Logout(c *gin.Context) {
	c.Header("Authorization", "")

	helpers.SendResponseHTTP(c, http.StatusCreated, "success", nil)
}
