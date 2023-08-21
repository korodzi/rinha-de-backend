import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  apelido: string;

  @Column()
  nome: string;

  @Column()
  nascimento: Date;

  @Column('varchar', { array: true, nullable: true })
  stack: string[];
}
