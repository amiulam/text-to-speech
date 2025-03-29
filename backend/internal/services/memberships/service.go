package memberships

import (
	"github.com/amiulam/text-to-speech/internal/configs"
	"github.com/amiulam/text-to-speech/internal/models/memberships"
)

type repository interface {
	CreateUser(model memberships.User) error
	GetUser(email, username string, id int64) (*memberships.User, error)
}

type service struct {
	cfg            *configs.Config
	membershipRepo repository
}

func NewService(cfg *configs.Config, membershipRepo repository) *service {
	return &service{
		cfg:            cfg,
		membershipRepo: membershipRepo,
	}
}
