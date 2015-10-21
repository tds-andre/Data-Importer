package com.maispartners.data_importer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.maispartners.data_importer.domain.transactions.Transaction;

@RepositoryRestResource(collectionResourceRel = "transaction", path = "transaction")
public interface TransactionRepo extends CrudRepository<Transaction, Long> {
	@Query(nativeQuery=true, value="SELECT *, max(created_at) FROM data_importer.transaction a left join data_importer.transaction_log b on a.id = b.transaction group by scd")
	public List<Transaction> latest();
	@Query(nativeQuery=true, value="select a.* from `transaction` a right join (SELECT max(created_at), transaction FROM data_importer.transaction_log group by transaction order by created_at desc limit 2) b on a.id=b.transaction")
	public List<Transaction> recent();
}