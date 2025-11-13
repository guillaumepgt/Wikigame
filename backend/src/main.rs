use actix_web::{App, HttpServer, web};
use actix_cors::Cors;
use sqlx::MySqlPool;

mod models;
mod handlers;
mod services;
mod routes;
mod config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = config::AppConfig::from_env();
    let addr = config.address();

    println!("🚀 Serveur lancé sur http://{}", addr);

    let pool = loop {
        match MySqlPool::connect(&config.database_url).await {
            Ok(pool) => {
                println!("Connexion à la base de données réussie!");
                break pool;
            }
            Err(e) => {
                println!("Erreur de connexion à la base de données: {}. Nouvelle tentative dans 5s...", e);
                tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
            }
        }
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .configure(routes::config)
    })
        .bind(&addr)?
        .run()
        .await
}
