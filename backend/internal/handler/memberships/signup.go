package memberships

import (
	"net/http"

	"github.com/amiulam/text-to-speech/helpers"
	"github.com/amiulam/text-to-speech/internal/models/memberships"
	"github.com/gin-gonic/gin"
)

func (h *Handler) SignUp(c *gin.Context) {
	var request memberships.SignUpRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.membershipSvc.SignUp(request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	helpers.SendResponseHTTP(c, http.StatusCreated, "success", nil)
}
