package backend.info;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InfoController {

	@RequestMapping(method = RequestMethod.GET, value = "/info", produces = APPLICATION_JSON_VALUE)
	public Info serverInfo() {
		final Info serverInfo = new Info();
		serverInfo.setName("Spring Boot Server: Backend");
		serverInfo.setVersion("1.0.0-beta");

		return serverInfo;
	}

}
