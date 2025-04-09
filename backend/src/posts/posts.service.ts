import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type Post = any;

@Injectable()
export class PostsService {
  private readonly posts = [
    {
      id: 1,
      authorId: 1,
      title: '111',
      votes: 11,
    },
    {
      id: 2,
      authorId: 1,
      title: '222',
      votes: 22,
    },
    {
      id: 3,
      authorId: 2,
      title: '333',
      votes: 33,
    },
    {
      id: 2,
      authorId: 3,
      title: '444',
      votes: 44,
    },
  ];

  async findAll(authorId: number): Promise<Post | undefined> {
    return this.posts.find(post => post.authorId === authorId);
  }
  async findOneById(id: number): Promise<Post | undefined> {
    return this.posts.find(post => post.id === id);
  }
}
