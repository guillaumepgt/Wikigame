use reqwest::Client;
use urlencoding::encode;
use crate::models::wikipedia_api::{ApiResponse, PageContentResponse};

pub async fn fetch_random_title() -> Result<String, Box<dyn std::error::Error>> {
    let url = "https://fr.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*";

    let client = Client::new();
    let response = client
        .get(url)
        .header("User-Agent", "RustActixBot/1.0 (https://example.com)")
        .send()
        .await?;

    let status = response.status();
    let text = response.text().await?;

    if status.is_success() {
        let data: ApiResponse = serde_json::from_str(&text)?;
        Ok(data.query.random[0].title.clone())
    } else {
        Err(format!("Erreur HTTP {}: {}", status, text).into())
    }
}

pub async fn fetch_page_content(title: String) -> Result<(String, String), Box<dyn std::error::Error>> {
    let client = Client::new();
    let encoded_title = encode(&title);

    let url = format!(
        "https://fr.wikipedia.org/w/api.php?action=parse&format=json&page={}&prop=text",
        encoded_title
    );

    let response = client.get(&url).header("User-Agent", "RustActixBot/1.0 (https://example.com)").send().await?;

    let text = response.text().await?;

    let page_response: PageContentResponse = serde_json::from_str(&text)
        .map_err(|e| format!("Erreur parsing JSON: {}. Réponse: {}", e, &text[..text.len().min(200)]))?;

    let content = page_response.parse.text.content;
    let link = format!("https://fr.wikipedia.org/wiki/{}", encoded_title);

    Ok((content, link))
}