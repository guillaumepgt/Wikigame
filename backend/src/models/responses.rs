use serde::Serialize;

#[derive(Serialize)]
pub struct TitleResponse {
    pub title: String,
}

#[derive(Serialize)]
pub struct LinkPage {
    pub link: String,
}

#[derive(Serialize)]
pub struct PageContentResponse {
    pub title: String,
    pub content: String,
    pub link: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}