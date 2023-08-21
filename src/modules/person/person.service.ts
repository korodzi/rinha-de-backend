import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { ILike, Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from './dto/query.dto';
import { Contains } from '../../utils/typeorm/Contains';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create({
    nome,
    apelido,
    nascimento,
    stack,
  }: CreateDto): Promise<Person> {
    const person = await this.personRepository.findOneBy({ apelido });

    if (person) {
      throw new UnprocessableEntityException();
    }

    return this.personRepository.save({
      nome,
      apelido,
      nascimento,
      stack,
    });
  }

  async getById(id: string): Promise<Person> {
    const person = await this.personRepository.findOneBy({ id });

    if (!person) {
      throw new NotFoundException();
    }

    return person;
  }

  getByQuery({ nome, apelido, stack }: QueryDto) {
    if (!nome && !apelido && !stack) {
      throw new BadRequestException();
    }

    return this.personRepository.find({
      where: {
        ...(nome && { nome: ILike(`%${nome}%`) }),
        ...(apelido && { apelido: ILike(`%${apelido}%`) }),
        ...(stack && { stack: Contains(`${stack}`) }),
      },
      take: 50,
    });
  }

  count() {
    return this.personRepository.count();
  }
}
