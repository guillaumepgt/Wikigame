use actix_web::web;
use crate::handlers::wiki;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/", web::get().to(wiki::root))
            .route("/random-page", web::get().to(wiki::get_random_page))
            .route("/page/{title}", web::get().to(wiki::get_page_content))
    )
        .service(
            web::scope("/api/v1")
                .route("/random-page", web::get().to(wiki::get_random_page))
                .route("/page/{title}", web::get().to(wiki::get_page_content))
        );
}