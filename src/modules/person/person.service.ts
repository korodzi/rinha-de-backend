import {
  BadRequestException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async create({
    nome,
    apelido,
    nascimento,
    stack,
  }: CreateDto): Promise<Person> {
    const exists = await this.personRepository.findOneBy({ apelido });

    if (exists) {
      throw new UnprocessableEntityException();
    }

    const person = await this.personRepository.save({
      nome,
      apelido,
      nascimento,
      stack,
    });

    await this.cacheService.set(person.id, person);

    return person;
  }

  async getById(id: string): Promise<Person> {
    const cached = await this.cacheService.get<Person>(id);

    if (cached) {
      return cached;
    }

    const person = await this.personRepository.findOneBy({ id });

    if (!person) {
      throw new NotFoundException();
    }

    await this.cacheService.set(person.id, person);

    return person;
  }

  async getByQuery({ nome, apelido, stack }: QueryDto) {
    if (!nome && !apelido && !stack) {
      throw new BadRequestException();
    }

    const id = `${nome}&${apelido}&${stack}`;

    const cached = await this.cacheService.get<Person[]>(id);

    if (cached) {
      return cached;
    }

    const persons = await this.personRepository.find({
      where: {
        ...(nome && { nome: ILike(`%${nome}%`) }),
        ...(apelido && { apelido: ILike(`%${apelido}%`) }),
        ...(stack && { stack: Contains(`${stack}`) }),
      },
      take: 50,
    });

    await this.cacheService.set(id, persons);

    return persons;
  }

  count() {
    return this.personRepository.count();
  }
}
