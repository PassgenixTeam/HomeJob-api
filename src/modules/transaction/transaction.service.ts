import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  create(input: CreateTransactionDto, userId: string) {
    const { amount, paymentMethodId, description, freelancerId, refId, type } =
      input;

    const transaction = new TransactionEntity();
    transaction.amount = amount;
    transaction.paymentMethodId = paymentMethodId;
    transaction.description = description;
    transaction.freelancerId = freelancerId;
    transaction.refId = refId;
    transaction.type = type;
    transaction.createdBy = userId;

    return this.transactionRepository.save(transaction);
  }

  findAll(userId: string) {
    return this.transactionRepository.find({
      where: { createdBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string, userId: string) {
    return this.transactionRepository.findOne({
      where: { id, createdBy: userId },
    });
  }
}
