package com.storechain.inventory;

import com.storechain.inventory.entities.Product;
import com.storechain.inventory.repository.ProductRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication

@OpenAPIDefinition(

		info = @Info(

				title = "API de Inventario - SmartLogix",

				version = "1.0",

				description = "Documentación del microservicio encargado de gestionar productos y control de stock."

		)

)
public class InventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(ProductRepository repository) {
		return args -> {
			// Solo carga si está vacío para no duplicar cada vez que reinicies
			if (repository.count() == 0) {
				repository.save(new Product("P001", "Laptop Gamer", "Alto rendimiento", 10.0, 1000000.0, "https://cl-dam-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/3840x0/filters:quality(75)/paris/635077999/variant/images/8bfe5fc5-fab8-451b-afc4-fb29696ebd9d/635077999-0000-007.jpg"));
				repository.save(new Product("P002", "Mouse Óptico", "Precisión total", 20.0, 25000.0, "https://pe-media.hptiendaenlinea.com/magefan_blog/mouse_ptico_vs_l_ser.jpg"));
				repository.save(new Product("P003", "Teclado Mecánico", "RGB retroiluminado", 15.0, 50000.0, "https://pronobel.cl/cdn/shop/files/p-523776-2-ae5ed3e1-9529-40de-a630-b9c7872b3ae3.jpg?v=1734102555&width=1946"));
			}
		};
	}
}