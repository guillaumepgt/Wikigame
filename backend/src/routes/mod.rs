use actix_web::web;
use crate::handlers::{wiki, multiplayer};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/", web::get().to(wiki::root))
            .route("/random-page", web::get().to(wiki::get_random_page))
            .route("/page/{title}", web::get().to(wiki::get_page_content))
            .route("/party/create", web::post().to(multiplayer::create_party))
            .route("/party", web::get().to(multiplayer::get_party))
            .route("/party/start/{id}", web::post().to(multiplayer::start_party))
    )
    .service(
        web::scope("/api/v1/party")
            .route("/", web::get().to(wiki::root))
            .route("/create", web::post().to(multiplayer::create_party))
    )
        .service(
            web::scope("/api/v1")
                .route("/random-page", web::get().to(wiki::get_random_page))
                .route("/page/{title}", web::get().to(wiki::get_page_content))
        );
}