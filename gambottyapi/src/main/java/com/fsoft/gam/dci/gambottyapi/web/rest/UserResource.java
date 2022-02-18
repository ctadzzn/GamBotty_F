package com.fsoft.gam.dci.gambottyapi.web.rest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fsoft.gam.dci.gambottyapi.exception.ResourceNotFoundException;
import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;
import com.fsoft.gam.dci.gambottyapi.domain.User;
import com.fsoft.gam.dci.gambottyapi.repository.UserRepository;
import com.fsoft.gam.dci.gambottyapi.service.ExcelService;
import com.fsoft.gam.dci.gambottyapi.service.FileSystemStorageService;

@RestController
@RequestMapping("/api/v1")
public class UserResource {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ExcelService excelService;

	@Autowired
	private FileSystemStorageService storageService;

	@GetMapping("/users")
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@GetMapping("/users/{id}")
	public ResponseEntity<User> getUserById(@PathVariable(value = "id") Long userId)
			throws ResourceNotFoundException {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userId));
		return ResponseEntity.ok().body(user);
	}

	@PostMapping("/users/user")
	public User addUser(@Valid @RequestBody User user) {
		return userRepository.save(user);
	}

	@PostMapping("/users")
	public List<User> addListUser(@Valid @RequestBody List<User> users) {
		for (User user : users) {
			userRepository.save(user);
		}
		return users;
	}

	// @PutMapping("/users/{id}")
	// public ResponseEntity<User> updateUser(@PathVariable(value = "id") Long
	// userId,
	// @Valid @RequestBody User userDetails) throws ResourceNotFoundException {
	// User user = userRepository.findById(userId)
	// .orElseThrow(() -> new ResourceNotFoundException("User not found for this id
	// :: " + userId));

	// user.setUserId(userDetails.getUserId());
	// user.setUserName(userDetails.getUserName());
	// final User updatedUser = userRepository.save(user);
	// return ResponseEntity.ok(updatedUser);
	// }

	@DeleteMapping("/users/{id}")
	public Map<String, Boolean> deleteUser(@PathVariable(value = "id") Long userId)
			throws ResourceNotFoundException {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userId));

		userRepository.delete(user);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
	}

	@PostMapping("/users/check")
	public ResponseEntity<Map<String, Object>> checkListRecipient(@Valid @RequestBody List<MessageUser> messageUsers,
			HttpServletRequest request)
			throws IOException {
		String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
				.replacePath(null)
				.build()
				.toUriString();
		Map<String, Object> result = new HashMap<>();
		//
		DateFormat dateFormatter = new SimpleDateFormat("yyyyMMddHHmmss");
		String currentDateTime = dateFormatter.format(new Date());
		String filename = "recipients" + currentDateTime + ".xlsx";
		//
		ByteArrayInputStream stream = excelService.listRecipientResultToExcel(messageUsers);
		if (stream != null) {
			storageService.store(stream, filename);
			result.put("message", "Has error account");
			result.put("url", baseUrl + "/api/v1/files/" + filename);
			return ResponseEntity.badRequest().body(result);
		} else {
			result.put("message", "OK");
			return ResponseEntity.ok().body(result);
		}
	}
}
