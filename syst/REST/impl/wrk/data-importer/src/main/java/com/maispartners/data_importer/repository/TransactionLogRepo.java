package com.maispartners.data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.maispartners.data_importer.domain.transactions.TransactionLog;

@RepositoryRestResource(collectionResourceRel = "log", path = "log")
public interface TransactionLogRepo extends CrudRepository<TransactionLog, Long>{
	
}
