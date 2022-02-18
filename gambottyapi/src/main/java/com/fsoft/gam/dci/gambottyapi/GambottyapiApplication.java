package com.fsoft.gam.dci.gambottyapi;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fsoft.gam.dci.gambottyapi.domain.User;
import com.fsoft.gam.dci.gambottyapi.repository.UserRepository;
import com.fsoft.gam.dci.gambottyapi.service.interfaces.StorageService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableScheduling
public class GambottyapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GambottyapiApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:3000",
								"https://localhost:3000",
								"http://localhost:8091",
								"https://localhost:8091")
						.allowedHeaders("*")
						.allowedMethods("*");
			}
		};
	}

	@Bean
	public CommandLineRunner init(UserRepository repository, StorageService storageService) {
		return (args) -> {
			repository.save(new User("100074648138376", "GAM.VN.GOS TEST (15)", "GAM.VN.GOS TEST (15)", "GAM", null));
			repository.save(new User("100074299794766", "GAM.VN.GOS TEST (14)", "GAM.VN.GOS TEST (14)", "GAM", null));
			repository.save(new User("100074399178365", "GAM.VN.GOS TEST (13)", "GAM.VN.GOS TEST (13)", "GAM", null));
			repository.save(new User("100074690460499", "GAM.VN.GOS TEST (12)", "GAM.VN.GOS TEST (12)", "GAM", null));
			repository.save(new User("100074498953253", "GAM.VN.GOS TEST (11)", "GAM.VN.GOS TEST (11)", "GAM", null));
			repository.save(new User("100074769993157", "GAM.VN.GOS TEST (10)", "GAM.VN.GOS TEST (10)", "GAM", null));
			repository.save(new User("100074313143819", "GAM.VN.GOS TEST (9)", "GAM.VN.GOS TEST (9)", "GAM", null));
			repository.save(new User("100074785380448", "GAM.VN.GOS TEST (8)", "GAM.VN.GOS TEST (8)", "GAM", null));
			repository.save(new User("100074350882511", "GAM.VN.GOS TEST (7)", "GAM.VN.GOS TEST (7)", "GAM", null));
			repository.save(new User("100074593119560", "GAM.VN.GOS TEST (6)", "GAM.VN.GOS TEST (6)", "GAM", null));
			repository.save(new User("100074553461601", "GAM.VN.GOS TEST (5)", "GAM.VN.GOS TEST (5)", "GAM", null));
			repository.save(new User("100074650530450", "GAM.VN.GOS TEST (4)", "GAM.VN.GOS TEST (4)", "GAM", null));
			repository.save(new User("100074278435579", "GAM.VN.GOS TEST (3)", "GAM.VN.GOS TEST (3)", "GAM", null));
			repository.save(new User("100074390388530", "GAM.VN.GOS TEST (2)", "GAM.VN.GOS TEST (2)", "GAM", null));
			repository.save(new User("100074630378774", "GAM.VN.GOS TEST (1)", "GAM.VN.GOS TEST (1)", "GAM", null));
			// Production
			Resource resource = new ClassPathResource("member_group_GAM.json");
			ObjectMapper mapper = new ObjectMapper();
			List<User> users = mapper.readValue(resource.getInputStream(), new TypeReference<List<User>>() {
			});
			for (User user : users) {
				repository.save(user);
			}
			// create dirs folder
			storageService.deleteAll();
			storageService.init();
		};
	}

}
