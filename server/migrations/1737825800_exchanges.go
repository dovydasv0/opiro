package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		exchanges, err := app.FindCollectionByNameOrId("exchanges")
		if err != nil {
			return err
		}

		binanceRecord := core.NewRecord(exchanges)
		binanceRecord.Set("exchange", "BINANCE")
		binanceRecord.Set("name", "Binance")
		binanceRecord.Set("api", "https://api.binance.com")

		krakenRecord := core.NewRecord(exchanges)
		krakenRecord.Set("exchange", "KRAKEN")
		krakenRecord.Set("name", "Kraken")
		krakenRecord.Set("api", "https://api.kraken.com")

		app.Save(binanceRecord)
		return app.Save(krakenRecord)

	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
