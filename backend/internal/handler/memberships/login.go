package memberships

import (
	"net/http"

	"github.com/amiulam/text-to-speech/helpers"
	"github.com/amiulam/text-to-speech/internal/models/memberships"
	"github.com/gin-gonic/gin"
)

func (h *Handler) Login(c *gin.Context) {
	var request memberships.LoginRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	accessToken, err := h.membershipSvc.Login(request)

	if err != nil {
		helpers.SendResponseHTTP(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	helpers.SendResponseHTTP(c, http.StatusOK, "success", memberships.LoginResponse{AccessToken: accessToken})
}
