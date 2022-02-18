package com.fsoft.gam.dci.gambottyapi.domain;

import java.util.*;
import javax.persistence.*;

@Entity
@Table(name = "message")
// @JsonIgnoreProperties(value = { "listMessageUser" }, allowSetters = true)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "accessToken", length = 2048, nullable = false)
    private String accessToken;

    @Column(name = "messageName", nullable = false)
    private String messageName;

    @Column(name = "textMessage", length = 100000, nullable = false)
    private String textMessage;

    @Column(name = "payload")
    private String payload;

    @Column(name = "imageUrl", length = 2048)
    private String imageUrl;

    @Column(name = "createdAt", nullable = false)
    private Date createdAt = new Date();

    @Column(name = "modifiedAt")
    private Date modifiedAt;

    @Column(name = "deletedAt")
    private Date deletedAt;

    @Column(name = "scheduled")
    private Date scheduled;

    @Column(name = "sentAt")
    private Date sentAt;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL)
    private Set<MessageUser> listMessageUser;

    public Message() {
    }

    public Message(Long id, String accessToken, String messageName, String textMessage, String payload, String imageUrl,
            Date createdAt, Date modifiedAt, Date deletedAt, Date scheduled, Date sentAt, String status,
            Set<MessageUser> listMessageUser) {
        this.id = id;
        this.accessToken = accessToken;
        this.messageName = messageName;
        this.textMessage = textMessage;
        this.payload = payload;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.deletedAt = deletedAt;
        this.scheduled = scheduled;
        this.sentAt = sentAt;
        this.status = status;
        this.listMessageUser = listMessageUser;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccessToken() {
        return this.accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getMessageName() {
        return this.messageName;
    }

    public void setMessageName(String messageName) {
        this.messageName = messageName;
    }

    public String getTextMessage() {
        return this.textMessage;
    }

    public void setTextMessage(String textMessage) {
        this.textMessage = textMessage;
    }

    public String getPayload() {
        return this.payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return this.modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Date getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Date getScheduled() {
        return this.scheduled;
    }

    public void setScheduled(Date scheduled) {
        this.scheduled = scheduled;
    }

    public Date getSentAt() {
        return this.sentAt;
    }

    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<MessageUser> getListMessageUser() {
        return this.listMessageUser;
    }

    public void setListMessageUser(Set<MessageUser> listMessageUser) {
        this.listMessageUser = listMessageUser;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", accessToken='" + getAccessToken() + "'" +
                ", messageName='" + getMessageName() + "'" +
                ", textMessage='" + getTextMessage() + "'" +
                ", payload='" + getPayload() + "'" +
                ", imageUrl='" + getImageUrl() + "'" +
                ", createdAt='" + getCreatedAt() + "'" +
                ", modifiedAt='" + getModifiedAt() + "'" +
                ", deletedAt='" + getDeletedAt() + "'" +
                ", scheduled='" + getScheduled() + "'" +
                ", sentAt='" + getSentAt() + "'" +
                ", status='" + getStatus() + "'" +
                ", listMessageUser='" + getListMessageUser() + "'" +
                "}";
    }
}
