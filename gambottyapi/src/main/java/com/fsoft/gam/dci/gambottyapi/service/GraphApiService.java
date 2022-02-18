package com.fsoft.gam.dci.gambottyapi.service;

import java.util.ArrayList;

import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

public class GraphApiService {

    private String server = "https://graph.facebook.com/v12.0/me";

    public GraphApiService() {
    }

    private WebClient buildWebClient() {
        return WebClient.builder()
                .baseUrl(server)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public Mono<String> get(String uri) {
        WebClient webClient = buildWebClient();
        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> post(String uri, String json) {
        WebClient webClient = buildWebClient();
        return webClient.post()
                .uri(uri)
                .bodyValue(json)
                .retrieve()
                .bodyToMono(String.class);
    }

    public String postReusableImage(String imgUrl, String accessToken) {
        //
        String endpoint = "/message_attachments?access_token=" + accessToken;

        JSONObject payload = new JSONObject();
        payload.put("is_reusable", true);
        payload.put("url", imgUrl);

        JSONObject attachment = new JSONObject();
        attachment.put("type", "image");
        attachment.put("payload", payload);

        JSONObject message = new JSONObject();
        message.put("attachment", attachment);

        JSONObject data = new JSONObject();
        data.put("message", message);

        String responseBody = post(endpoint, data.toString()).block();
        JSONObject obj = new JSONObject(responseBody);
        return obj.getString("attachment_id");
    }

    public Mono<String> sendImage(String userId, String attachmentId, String accessToken) {
        //
        String endpoint = "/messages?access_token=" + accessToken;

        JSONObject payload = new JSONObject();
        payload.put("attachment_id", attachmentId);

        JSONObject attachment = new JSONObject();
        attachment.put("type", "image");
        attachment.put("payload", payload);

        JSONObject message = new JSONObject();
        message.put("attachment", attachment);

        JSONObject recipient = new JSONObject();
        recipient.put("id", userId);

        JSONObject data = new JSONObject();
        data.put("recipient", recipient);
        data.put("message", message);

        return post(endpoint, data.toString());
    }

    public Mono<String> sendTextMessage(String userId, String text, String accessToken) {
        //
        String endpoint = "/messages?access_token=" + accessToken;

        JSONObject message = new JSONObject();
        message.put("text", text);

        JSONObject recipient = new JSONObject();
        recipient.put("id", userId);

        JSONObject data = new JSONObject();
        data.put("recipient", recipient);
        data.put("message", message);

        return post(endpoint, data.toString());
    }

    public String convertBase64(String message, String message_id) {
        JSONObject tendanhgia = new JSONObject();
        tendanhgia.put("ten_danh_gia", message);
        tendanhgia.put("message_id", message_id);
        JSONObject payload = new JSONObject();
        payload.put("set_attributes", tendanhgia);
        byte[] bytesEncoded = Base64.encodeBase64(payload.toString().getBytes());
        String value = new String(bytesEncoded);
        return value;
    }

    // convert message payload to base 64 string
    public String convertBase64_SurveySao(String message, String star, String message_id) {
        JSONObject set_attributes = new JSONObject();
        set_attributes.put("ten_danh_gia", message);
        set_attributes.put("user_choose", star);
        set_attributes.put("message_id", message_id);

        JSONObject payload = new JSONObject();
        payload.put("set_attributes", set_attributes);

        byte[] bytesEncoded = Base64.encodeBase64(payload.toString().getBytes());
        String value = new String(bytesEncoded);
        return value;
    }

    public Mono<String> sendSurvey(String userId, String text, String accessToken, String payloadType,
            String message_id) {
        String endpoint = "/messages?access_token=" + accessToken;

        ArrayList<JSONObject> buttons = new ArrayList<>();
        JSONObject message = new JSONObject();

        if (payloadType.equals("question")) {
            JSONObject button = new JSONObject();
            button.put("type", "postback");
            button.put("title", "Đánh giá");
            button.put("payload", "Đánh giá Q&A#" + convertBase64(text, message_id) + "#Đánh giá");

            // JSONObject btn_1sao = new JSONObject();
            // btn_1sao.put("type", "value");
            // JSONObject buttons = new JSONObject();
            // buttons.put("buttons", buttons);
            buttons.add(button);

            JSONObject payload = new JSONObject();
            payload.put("template_type", "button");
            payload.put("text", text);
            payload.put("buttons", buttons);

            JSONObject attachment = new JSONObject();
            attachment.put("type", "template");
            attachment.put("payload", payload);
            message.put("attachment", attachment);

        } else {

            JSONObject btn_1sao = new JSONObject();
            btn_1sao.put("content_type", "text");
            btn_1sao.put("title", "⭐");
            btn_1sao.put("payload", "Câu 1:1 sao#" + convertBase64_SurveySao(text, "1", message_id) + "#Đánh giá");
            JSONObject btn_2sao = new JSONObject();
            btn_2sao.put("content_type", "text");
            btn_2sao.put("title", "⭐⭐");
            btn_2sao.put("payload", "Câu 1:1 sao#" + convertBase64_SurveySao(text, "2", message_id) + "#Đánh giá");
            JSONObject btn_3sao = new JSONObject();
            btn_3sao.put("content_type", "text");
            btn_3sao.put("title", "⭐⭐⭐");
            btn_3sao.put("payload", "Câu 1:1 sao#" + convertBase64_SurveySao(text, "3", message_id) + "#Đánh giá");
            JSONObject btn_4sao = new JSONObject();
            btn_4sao.put("content_type", "text");
            btn_4sao.put("title", "⭐⭐⭐⭐");
            btn_4sao.put("payload", "Câu 1:5 sao#" + convertBase64_SurveySao(text, "4", message_id) + "#Đánh giá");
            JSONObject btn_5sao = new JSONObject();
            btn_5sao.put("content_type", "text");
            btn_5sao.put("title", "⭐⭐⭐⭐⭐");
            btn_5sao.put("payload", "Câu 1:5 sao#" + convertBase64_SurveySao(text, "5", message_id) + "#Đánh giá");
            buttons.add(btn_1sao);
            buttons.add(btn_2sao);
            buttons.add(btn_3sao);
            buttons.add(btn_4sao);
            buttons.add(btn_5sao);

            message.put("text", text);
            message.put("quick_replies", buttons);
        }

        JSONObject recipient = new JSONObject();
        recipient.put("id", userId);
        JSONObject data = new JSONObject();
        data.put("recipient", recipient);
        data.put("message", message);
        return post(endpoint, data.toString());
    }
}
