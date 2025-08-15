import { HttpException, Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';

@Injectable()
export class AiService {
  async create(createAiDto: CreateAiDto) {
    const { mode, promt,session_id,user_plan } = createAiDto;
    try {
      const response = await fetch(`${process.env.AI_URL}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ tone: mode, text: promt, session_id,user_plan}),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  async getAllHistory(session_id) {
    
    try{
      const response = fetch(`${process.env.AI_URL}/memory`, {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({session_id})
      })
      const data=await (await response).json();
      return data;
    }catch(err){
      throw new HttpException(err.message, 500);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ai`;
  }

  update(id: number, updateAiDto: UpdateAiDto) {
    return `This action updates a #${id} ai`;
  }

  remove(id: number) {
    return `This action removes a #${id} ai`;
  }
}
