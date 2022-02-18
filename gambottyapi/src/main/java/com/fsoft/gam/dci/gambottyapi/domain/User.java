package com.fsoft.gam.dci.gambottyapi.domain;

import javax.persistence.*;

@Entity
@Table(name = "list_user")
public class User {

	@Id
	@Column(name = "id")
	private String id;

	@Column(name = "user_name", nullable = false)
	private String username;

	@Column(name = "account", nullable = false)
	private String account;

	@Column(name = "bu")
	private String bu;

	@Column(name = "email")
	private String email;

	public User() {
	}

	public User(String id, String account, String username, String bu, String email) {
		this.id = id;
		this.username = username;
		this.account = account.toLowerCase();
		this.bu = bu;
		this.email = email;
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getAccount() {
		return this.account.toLowerCase();
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getBu() {
		return this.bu;
	}

	public void setBu(String bu) {
		this.bu = bu;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "{" +
				" id='" + getId() + "'" +
				", username='" + getUsername() + "'" +
				", account='" + getAccount() + "'" +
				", bu='" + getBu() + "'" +
				", email='" + getEmail() + "'" +
				"}";
	}
}
