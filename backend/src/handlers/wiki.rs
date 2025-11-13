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
    match fetch_random_page_data().await {
        Ok(page) => HttpResponse::Ok().json(PageContentResponse {
            title: page.title,
            content: page.content,
            link: page.link,
        }),
        Err(e) => HttpResponse::InternalServerError().json(ErrorResponse {
            error: format!("Erreur fetch page: {}", e),
        }),
    }
}

pub async fn fetch_random_page_data() -> Result<PageContentResponse, Box<dyn std::error::Error>> {
    let title = wikipedia::fetch_random_title().await?;
    let (content, link) = wikipedia::fetch_page_content(title.clone()).await?;

    Ok(PageContentResponse {
        title,
        content,
        link,
    })
}