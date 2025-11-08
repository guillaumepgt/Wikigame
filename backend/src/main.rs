use actix_web::{App, HttpServer};

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
            .configure(routes::config)
    })
        .bind(&addr)?
        .run()
        .await
}