package com.maispartners.data_importer.config;

import java.io.Serializable;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableAutoConfiguration
@EnableTransactionManagement()
@EnableJpaRepositories(entityManagerFactoryRef = "diEntityManagerFactory", transactionManagerRef = "diTransactionManager", basePackages = { "com.maispartners.data_importer.repository" })
@ComponentScan(basePackages = { "com.maispartners.data_importer.services" })
public class CoreDataImporterConfig implements Serializable {

	@Autowired
	private Environment environment;

	@Bean
	public JpaVendorAdapter jpaVendorAdapter() {
		HibernateJpaVendorAdapter adaptor = new HibernateJpaVendorAdapter();
		adaptor.setShowSql(false);
		adaptor.setGenerateDdl(true);
		adaptor.setDatabase(org.springframework.orm.jpa.vendor.Database.POSTGRESQL);
		adaptor.setDatabasePlatform("org.hibernate.dialect.PostgreSQLDialect");
		return adaptor;
	}

	@Primary
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource_data_importer")
	public DataSource diDatasource() {
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "diEntityManager")
	public EntityManager entityManager() {
		return entityManagerFactory().createEntityManager();
	}

	@Bean(name = "diEntityManagerFactory")
	public EntityManagerFactory entityManagerFactory() {
		LocalContainerEntityManagerFactoryBean lef = new LocalContainerEntityManagerFactoryBean();
		lef.setDataSource(diDatasource());
		lef.setJpaVendorAdapter(jpaVendorAdapter());
		lef.setPackagesToScan("com.maispartners.data_importer.domain");
		lef.setPersistenceUnitName("diPersistenceUnit");
		lef.afterPropertiesSet();
		return lef.getObject();
	}

	@Bean(name = "diTransactionManager")
	public PlatformTransactionManager diTransactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager(
				entityManagerFactory());
		transactionManager.setEntityManagerFactory(entityManagerFactory());
		transactionManager.setDataSource(diDatasource());
		return transactionManager;
	}
}
