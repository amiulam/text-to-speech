package memberships

import (
	"github.com/amiulam/text-to-speech/internal/middleware"
	"github.com/amiulam/text-to-speech/internal/models/memberships"
	"github.com/gin-gonic/gin"
)

type service interface {
	SignUp(request memberships.SignUpRequest) error
	Login(request memberships.LoginRequest) (string, error)
}

type Handler struct {
	*gin.Engine
	membershipSvc service
}

func NewHandler(api *gin.Engine, membershipSvc service) *Handler {
	return &Handler{
		Engine:        api,
		membershipSvc: membershipSvc,
	}
}

func (h *Handler) RegisterRoute() {
	route := h.Group("memberships")

	route.POST("sign-up", h.SignUp)
	route.POST("login", h.Login)
	route.POST("logout", middleware.AuthMiddleware(), h.Logout)
}
