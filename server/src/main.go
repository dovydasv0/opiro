package main

import (
	_ "github.com/dovydasv0/opiro/migrations"
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
	app := pocketbase.New()
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{Automigrate: isGoRun})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
