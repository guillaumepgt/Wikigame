use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Deserialize, Debug)]
pub struct ApiResponse {
    pub query: Query,
}

#[derive(Deserialize, Debug)]
pub struct Query {
    pub random: Vec<RandomPage>,
}

#[derive(Deserialize, Debug)]
pub struct RandomPage {
    pub title: String,
}

#[derive(Deserialize, Debug)]
pub struct PageContentResponse {
    pub parse: ParseContent,
}

#[derive(Deserialize, Debug)]
pub struct ParseContent {
    pub text: TextContent,
}

#[derive(Deserialize, Debug)]
pub struct TextContent {
    #[serde(rename = "*")]
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Party {
    pub id: String,
    pub title: String,
    pub status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreatePartyRequest {
    pub title: String,
}