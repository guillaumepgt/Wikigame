use actix_web::{HttpResponse, Responder, web};
use crate::models::responses::{PageContentResponse, ErrorResponse};
use crate::services::wikipedia;

pub async fn root() -> impl Responder {
    "Bienvenue sur l'API Rust 🚀"
}

pub async fn get_page_content(path: web::Path<String>) -> impl Responder {
    let title = path.into_inner();

    match wikipedia::fetch_page_content(title.clone()).await {
        Ok((content, link)) => HttpResponse::Ok().json(PageContentResponse {
            title,
            content,
            link,
        }),
        Err(e) => HttpResponse::InternalServerError()
            .json(ErrorResponse {
                error: format!("Erreur fetch content: {}", e)
            }),
    }
}

pub async fn get_random_page() -> impl Responder {
    let title = match wikipedia::fetch_random_title().await {
        Ok(t) => t,
        Err(e) => {
            return HttpResponse::InternalServerError()
                .json(ErrorResponse {
                    error: format!("Erreur fetch title: {}", e)
                })
        }
    };

    match wikipedia::fetch_page_content(title.clone()).await {
        Ok((content, link)) => HttpResponse::Ok().json(PageContentResponse {
            title,
            content,
            link,
        }),
        Err(e) => HttpResponse::InternalServerError()
            .json(ErrorResponse {
                error: format!("Erreur fetch content: {}", e)
            }),
    }
}