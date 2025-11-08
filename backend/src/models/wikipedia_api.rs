use serde::Deserialize;

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