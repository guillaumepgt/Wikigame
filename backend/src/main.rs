use actix_web::{App, HttpServer};
use actix_cors::Cors;

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

    HttpServer::new(|| {
        App::new()
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