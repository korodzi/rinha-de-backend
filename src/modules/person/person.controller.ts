import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Response,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreateDto } from './dto/create.dto';
import { Response as Res } from 'express';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('pessoas')
  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  )
  async create(@Body() dto: CreateDto, @Response() res: Res) {
    const ret = await this.personService.create(dto);
    res.set({ Location: `/pessoas/${ret.id}` }).json(ret);
    return res;
  }

  @Get('pessoas/:id')
  getById(@Param('id') id: string) {
    return this.personService.getById(id);
  }

  @Get('pessoas')
  getByQuery(@Query('t') query: string) {
    return this.personService.getByQuery(query);
  }

  @Get('contagem-pessoas')
  count() {
    return this.personService.count();
  }
}
