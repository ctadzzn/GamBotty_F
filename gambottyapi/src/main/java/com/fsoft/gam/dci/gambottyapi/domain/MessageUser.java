package com.fsoft.gam.dci.gambottyapi.domain;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "message_user")
public class MessageUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;

	@Column(name = "account", nullable = false)
	private String account;

	@ManyToOne
	@JoinColumn(name = "messageId", nullable = false)
	@JsonIgnoreProperties(value = { "listMessageUser" })
	private Message message;

	@Column(name = "status")
	private String status;

	@Column(name = "failMessage")
	private String failMessage;

	public MessageUser() {
	}

	public MessageUser(long id, String account, Message message, String status, String failMessage) {
		this.id = id;
		this.account = account.toLowerCase();
		this.message = message;
		this.status = status;
		this.failMessage = failMessage;
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAccount() {
		return this.account.toLowerCase();
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public Message getMessage() {
		return this.message;
	}

	public void setMessage(Message message) {
		this.message = message;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getFailMessage() {
		return this.failMessage;
	}

	public void setFailMessage(String failMessage) {
		this.failMessage = failMessage;
	}

	@Override
	public String toString() {
		return "{" +
				" id='" + getId() + "'" +
				", account='" + getAccount() + "'" +
				", message='" + getMessage() + "'" +
				", status='" + getStatus() + "'" +
				", failMessage='" + getFailMessage() + "'" +
				"}";
	}
}
