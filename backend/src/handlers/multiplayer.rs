use sqlx::{MySqlPool};
use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;
use serde_json::json;
use crate::models::wikipedia_api::{Party, CreatePartyRequest};
use crate::handlers::wiki::fetch_random_page_data;

pub async fn create_party(
    pool: web::Data<MySqlPool>,
    payload: web::Json<CreatePartyRequest>,
) -> impl Responder {
    let id = Uuid::new_v4().to_string();
    let result = sqlx::query(
        "INSERT INTO parties (id, title, status) VALUES (?, ?, 'waiting')"
    )
        .bind(&id)
        .bind(&payload.title)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(_) => {
            let party = Party {
                id,
                title: payload.title.clone(),
                status: "waiting".to_string(),
            };
            HttpResponse::Ok().json(party)
        },
        Err(err) => {
            eprintln!("Erreur SQL: {:?}", err);
            HttpResponse::InternalServerError().body("Erreur lors de la création de la partie")
        }
    }
}

pub async fn get_party(pool: web::Data<MySqlPool>) -> impl Responder {
    let results = sqlx::query_as::<_, Party>(
        "SELECT id, title, status FROM parties ORDER BY id"
    )
        .fetch_all(pool.get_ref())
        .await;

    match results {
        Ok(parties) => HttpResponse::Ok().json(parties),
        Err(err) => {
            eprintln!("❌ Erreur SQL: {:?}", err);
            HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Erreur lors de la récupération des parties"
            }))
        }
    }
}

pub async fn start_party(pool: web::Data<MySqlPool>, path: web::Path<String>) -> impl Responder {
    let party_id = path.into_inner();
    let game_id = Uuid::new_v4().to_string();

    let first_page = match fetch_random_page_data().await {
        Ok(page) => page.title,
        Err(e) => {
            eprintln!("Erreur fetch page: {:?}", e);
            return HttpResponse::InternalServerError().json(json!({
            "error": "Impossible de récupérer la première page"
        }));
        }
    };

    let last_page = match fetch_random_page_data().await {
        Ok(page) => page.title,
        Err(e) => {
            eprintln!("Erreur fetch page: {:?}", e);
            return HttpResponse::InternalServerError().json(json!({
            "error": "Impossible de récupérer la dernière page"
        }));
        }
    };

    let mut tx = match pool.begin().await {
        Ok(tx) => tx,
        Err(err) => {
            eprintln!("Erreur de transaction: {:?}", err);
            return HttpResponse::InternalServerError().json(json!({"error": "Erreur de transaction"}));
        }
    };

    if let Err(err) = sqlx::query(
        "INSERT INTO game_state (id, party_id, first_page, last_page) VALUES (?, ?, ?, ?)"
    )
        .bind(&game_id)
        .bind(&party_id)
        .bind(&first_page)
        .bind(&last_page)
        .execute(tx.as_mut())
        .await
    {
        eprintln!("Erreur insertion game_state: {:?}", err);
        return HttpResponse::InternalServerError().json(json!({"error": "Impossible de créer l'état de jeu"}));
    }

    let result = sqlx::query("UPDATE parties SET status = 'started' WHERE id = ?")
        .bind(&party_id)
        .execute(tx.as_mut())
        .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                return HttpResponse::NotFound().json(json!({"error": "Partie non trouvée"}));
            }
        }
        Err(err) => {
            eprintln!("Erreur update partie: {:?}", err);
            return HttpResponse::InternalServerError().json(json!({"error": "Erreur lors du démarrage de la partie"}));
        }
    }
    if let Err(err) = tx.commit().await {
        eprintln!("Erreur commit transaction: {:?}", err);
        return HttpResponse::InternalServerError().json(json!({"error": "Erreur lors du démarrage de la partie"}));
    }

    HttpResponse::Ok().json(json!({
        "message": "La partie a bien été démarrée",
        "id": party_id
    }))
}