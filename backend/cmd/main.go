package main

import (
	"log"

	"github.com/amiulam/text-to-speech/internal/configs"
	conversionHandler "github.com/amiulam/text-to-speech/internal/handler/conversions"
	membershipHandler "github.com/amiulam/text-to-speech/internal/handler/memberships"
	"github.com/amiulam/text-to-speech/internal/models/conversions"
	"github.com/amiulam/text-to-speech/internal/models/memberships"
	conversionRepo "github.com/amiulam/text-to-speech/internal/repository/conversions"
	membershipRepo "github.com/amiulam/text-to-speech/internal/repository/memberships"
	conversionSvc "github.com/amiulam/text-to-speech/internal/services/conversions"
	membershipSvc "github.com/amiulam/text-to-speech/internal/services/memberships"
	"github.com/amiulam/text-to-speech/pkg/internalsql"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	var (
		cfg *configs.Config
	)

	err := configs.Init(
		configs.WithConfigFolder([]string{"./internal/configs"}),
		configs.WithConfigFile("config"),
		configs.WithConfigType("yaml"),
	)

	if err != nil {
		log.Fatal("Fail to initialized config", err)
	}

	cfg = configs.Get()

	db, err := internalsql.Connect(cfg.Database.DatabaseSourceName)
	if err != nil {
		log.Fatal("Failed to connect to database ", err)
	}

	err = db.AutoMigrate(&memberships.User{}, &conversions.TextToSpeech{})
	if err != nil {
		log.Fatal("Failed to migrate database ", err)
	}

	log.Println("Database migrated successfully")

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Izinkan origin frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60, // Cache preflight request selama 12 jam
	}))
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Repository
	membershipRepo := membershipRepo.NewRepository(db)
	conversionRepo := conversionRepo.NewRepository(db)

	// Services
	membershipSvc := membershipSvc.NewService(cfg, membershipRepo)
	conversionSvc := conversionSvc.NewService(cfg, conversionRepo)

	// Handlers
	membershipHandler := membershipHandler.NewHandler(r, membershipSvc)
	conversionHandler := conversionHandler.NewHandler(r, conversionSvc)

	// Routes
	membershipHandler.RegisterRoute()
	conversionHandler.RegisterRoute()

	if err != nil {
		log.Fatalf("fail to connect to database, err: %+v", err)
	}

	r.Run(cfg.Service.Port)
}
