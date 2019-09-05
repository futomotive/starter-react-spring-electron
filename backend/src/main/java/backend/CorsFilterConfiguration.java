package backend;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// IMPORTANT: this has to be a normal configuration class, not extending 
// WebMvcConfigurerAdapter or other Spring Security class
@Configuration
public class CorsFilterConfiguration {
	@Bean
	public FilterRegistrationBean<CorsFilter> customCorsFilter() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:3000");
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");
		source.registerCorsConfiguration("/**", config);
		final FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));

		// IMPORTANT: tell Spring to load this filter at the right point in
		// the chain (with an order of precedence higher than oauth2's filters)
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}
}
