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
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	err := h.membershipSvc.SignUp(request)

	if err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	helpers.SendResponseHTTP(c, http.StatusCreated, "success", nil)
}
