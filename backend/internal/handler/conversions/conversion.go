package conversions

import (
	"net/http"

	"github.com/amiulam/text-to-speech/helpers"
	"github.com/amiulam/text-to-speech/internal/models/conversions"
	"github.com/gin-gonic/gin"
)

func (h *Handler) SaveConversion(c *gin.Context) {
	var request conversions.ConversionRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	result, err := h.conversionSvc.SaveConversion(request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	helpers.SendResponseHTTP(c, http.StatusCreated, "success", result)
}

func (h *Handler) GetAllConversion(c *gin.Context) {
	result, err := h.conversionSvc.GetConversions()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	helpers.SendResponseHTTP(c, http.StatusOK, "success", result)
}
